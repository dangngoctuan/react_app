import React from 'react';
import App from '../../App';
import { configure } from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
const assert = require('assert');
const { Given, When, Then } = require('cucumber');
configure({ adapter: new Adapter() });

Given('Launch App', function () {
    const { JSDOM } = require('jsdom');
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
    const { window } = jsdom;
    global.window = window;
    global.document = window.document;
});


When('Press {string}', function (string) {
  const addTodoButton = this.wrapper
    .find('Button')
    .findWhere((w) => w.text() === 'Login with Facebook')
    .first();
  addTodoButton.props().onPress();
});

When('I should see a text {string}', function (string) {
  assert(this.wrapper.contains('Hi'));
});


When('Press {string}', function (string) {
  const addLogoutButton = this.wrapper
    .find('Button')
    .findWhere((w) => w.text() === 'Logout')
    .first();
  addLogoutButton.props().onPress();
});

Then('Should see the button', function () {
  assert(this.wrapper.contains('Login with Facebook'));
});
