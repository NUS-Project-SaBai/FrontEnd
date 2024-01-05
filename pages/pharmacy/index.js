import React from "react";
import Router from 'next/router'

export default class Pharmacy extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
        res.writeHead(302, {
          Location: '/pharmacy/stock'
        })
        res.end()
      } else {
        Router.push('/pharmacy/stock')
      }
      return {}
  }
}