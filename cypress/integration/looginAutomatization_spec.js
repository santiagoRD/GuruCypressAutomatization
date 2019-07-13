const faker = require("faker");

describe("Gettin credentials and login in the app", () => {
  beforeEach(function() {
    cy.fixture("users/dataTest").as("dataTest");
  });

  const deleteAccount = accID => {
    let alertedMessage = "";
    cy.visit("http://demo.guru99.com/V4/manager/deleteAccountInput.php");
    cy.get(":nth-child(6) > :nth-child(2) > input")
      .should("be.empty")
      .type(accID)
      .should("have.value", accID);
    cy.on("window:alert", msg => (alertedMessage = msg));
    cy.get("form[name='fbal']")
      .submit()
      .then(() => {
        expect(alertedMessage).to.match(/Account Deleted Sucessfully/);
      });
  };

  const createNewAcc = (cID, accType, initialDep) => {
    cy.visit("http://demo.guru99.com/V4/manager/addAccount.php");
    cy.get(":nth-child(2) > :nth-child(2) > input")
      .should("be.empty")
      .type(cID)
      .should("have.value", cID);
    cy.get("select")
      .select(accType)
      .should("have.value", accType);
    cy.get(":nth-child(4) > :nth-child(2) > input")
      .type(initialDep)
      .should("have.value", initialDep);
    cy.get("form[name='form1']").submit();
    cy.get("tbody > :nth-child(4) > :nth-child(2)")
      .invoke("text")
      .then(accID => {
        deleteAccount(accID);
      });
  };

  const createNewCostumer = (dataTest, accountCustomer) => {
    cy.visit(dataTest.url);
    cy.get(":nth-child(1) > :nth-child(2) > input")
      .type(dataTest.id)
      .should("have.value", dataTest.id);
    cy.get(":nth-child(2) > :nth-child(2) > input")
      .type(dataTest.pass)
      .should("have.value", dataTest.pass);
    cy.get("form").submit();
    cy.get("tr.heading3 > td").should("to.contain", dataTest.id);

    cy.get(".menusubnav > :nth-child(2) > a")
      .click()
      .get(":nth-child(4) > :nth-child(2) > input")
      .should("be.empty");
    cy.get(":nth-child(4) > :nth-child(2) > input")
      .type(dataTest.name)
      .should("have.value", dataTest.name);
    cy.get("tbody > :nth-child(5) > :nth-child(2)")
      .find(`[value=${dataTest.gender}]`)
      .check();
    cy.get("#dob")
      .type(dataTest.birth)
      .should("have.value", dataTest.birth);
    cy.get("textarea")
      .type(dataTest.address)
      .should("have.value", dataTest.address);
    cy.get(":nth-child(8) > :nth-child(2) > input")
      .type(dataTest.city)
      .should("have.value", dataTest.city);
    cy.get(":nth-child(9) > :nth-child(2) > input")
      .type(dataTest.state)
      .should("have.value", dataTest.state);
    cy.get(":nth-child(10) > :nth-child(2) > input")
      .type(dataTest.pin)
      .should("have.value", dataTest.pin);
    cy.get(":nth-child(11) > :nth-child(2) > input")
      .type(dataTest.mobileNumber)
      .should("have.value", dataTest.mobileNumber);
    cy.get(":nth-child(12) > :nth-child(2) > input")
      .type(accountCustomer)
      .should("have.value", accountCustomer);
    cy.get(":nth-child(13) > :nth-child(2) > input")
      .type(dataTest.passCustomer)
      .should("have.value", dataTest.passCustomer);
    cy.get("form[name='addcust']").submit();

    cy.get("tbody > :nth-child(4) > :nth-child(2)")
      .invoke("text")
      .then(value => {
        createNewAcc(value, dataTest.accountType, dataTest.initialDeposit);
      });
  };

  it("Visit here link to get de credentials", function() {
    let accountCustomer = faker.internet.email(); //Random Email Generator

    cy.visit(this.dataTest.url)
      .get("ol > :nth-child(1) > a")
      .click();
    cy.get(":nth-child(5) > :nth-child(2) > input").should("be.empty");
    cy.get(":nth-child(5) > :nth-child(2) > input")
      .type(this.dataTest.email)
      .should("have.value", this.dataTest.email);
    cy.get("form").submit();
    cy.get(":nth-child(4) > .accpage").should("be.visible");
    cy.get("body > table > tbody > tr:nth-child(4) > td:nth-child(2)")
      .should("to.contain", this.dataTest.id)
      .then(() => {
        createNewCostumer(this.dataTest, accountCustomer);
      });
  });
});
