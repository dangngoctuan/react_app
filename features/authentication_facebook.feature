Feature: Authentication Facebook
Background:
  Given Launch App
Scenario: Authentication valid with Facebook
  When Press 'Login with Facebook'
  And I should see a text 'Hi'
  When Press 'Logout'
  Then Should see the button
  And Text is 'Login with Facebook'
