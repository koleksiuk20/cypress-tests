Feature: Customer login
  As a Customer 
  I would like to log in to my account with my e-mail and password.

  Background:
  Given I have started "Customer" "login"

  Scenario: I can login successfully
    When I complete "Customer" "login" modal with the following credentials:
      | email    | kamil@example.com |
      | password | P4$$wtest         |
    Then I should see that I am logged in as "Customer"

  Scenario Outline: I receive error message about login errors
    Given these error messages exist
      | error               | hint                |
      | blank password      | Field is required   |
      | blank email         | Field is required   | 
      | invalid email       | Invalid email       |
      | invalid password    | Invalid credentials |
      | short password      | Invalid credentials |
      | unavailable user id | Invalid credentials | 
    # And someone has registered with the email 'kamil@example.com'
    When I complete "Customer" "login" modal with the following credentials:
      | email                 | <email>        |
      | password              | <password>     |
    Then this inline error message "<error>" is visible

    Examples: of common login problems
      | email                               | password  | error               |
      | kamil.oleksiuk+customerdev00@ynd.co | P4$$wtest | invalid password    |
      | kamil.oleksiuk+customerdev00@ynd.co |           | blank password      |
      | kamil                               | P4$$wtest | invalid email       |
      |                                     | P4$$wtest | blank email         |
      | kamil@example.com                   | P4$$wtest | unavailable user id |
