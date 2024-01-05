import React from "react";
import Router from 'next/router'

export default class Analytics extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
        res.writeHead(302, {
          Location: '/analytics/daily'
        })
        res.end()
      } else {
        Router.push('/analytics/daily')
      }
      return {}
  }
}