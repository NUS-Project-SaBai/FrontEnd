import React from "react";
import Modal from "react-modal";
import axios from "axios";
import { API_URL } from "../utils/constants";
import withAuth from "../utils/auth";

Modal.setAppElement("#__next");

class Users extends React.Component {
  constructor() {
    super();

    this.state = {
      users: [],
      usersFiltered: [],
      userDetails: {},
      modalIsOpen: false,
      filterString: "",
      userForm: {
        isDoctor: false,
      },
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: users } = await axios.get(`${API_URL}/users`);

    this.setState({
      users,
      usersFiltered: users,
      userForm: { isDoctor: false },
    });
  }

  // async onSubmitForm() {
  //   let { userForm } = this.state;

  //   let first_name = userForm.isDoctor ? "Dr." : "";
  //   let username = userForm.name.split(" ").join("");
  //   let password = userForm.name.split(" ").join("_");
  //   let payload = {
  //     username,
  //     password,
  //     first_name,
  //     last_name: userForm.name,
  //   };

  //   await axios.post(`${API_URL}/users`, payload);

  //   this.toggleModal();
  //   this.onRefresh();
  // }

  onFilterChange(event) {
    // get
    let { users } = this.state;

    let usersFiltered = users.filter((user) => {
      // let name =
      //   `${user.fields.first_name} ${user.fields.last_name}`.toLowerCase();
      let name = `${user.fields.username}`.toLowerCase();
      return name.includes(event.target.value.toLowerCase());
    });

    this.setState({ usersFiltered });
  }

  /**
   * open the modal
   * load the appropriate medication
   */
  toggleModal() {
    let changes = {
      modalIsOpen: !this.state.modalIsOpen,
    };

    this.setState(changes);
  }

  handleInputChange(event) {
    let { userForm } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    userForm[name] = value;
    this.setState({
      userForm,
    });
  }

  handleUserChange(event) {
    let { userDetails } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    userDetails[name] = value;

    this.setState({
      userDetails,
    });
  }

  renderRows() {
    let { usersFiltered: users } = this.state;
    let tableRows = users.map((user) => {
      let username = user.fields.username;
      return (
        <tr key={user.pk}>
          <td>{username}</td>
          <td>
            <button
              className="button is-danger"
              onClick={() => this.handleDelete(user.pk)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    return tableRows;
  }

  async handleDelete(pk) {
    const { users, usersFiltered } = this.state;

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${pk}`);
      const updatedUsers = users.filter((user) => user.pk !== pk);
      const updatedUsersFiltered = usersFiltered.filter(
        (user) => user.pk !== pk
      );
      this.setState({
        users: updatedUsers,
        usersFiltered: updatedUsersFiltered,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Users</h1>
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="Search Users"
              onChange={this.onFilterChange}
            />
          </div>

          <br></br>

          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th colSpan="2">Username</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const userModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
};

// className UserForm extends React.Component {
//   constructor() {
//     super();
//   }

//   render() {
//     let { content } = this.state;

//     return(

//     )
//   }
// }

export default withAuth(Users);
