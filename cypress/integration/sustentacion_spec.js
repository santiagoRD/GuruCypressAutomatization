import { exportAllDeclaration } from "@babel/types";

//sustentacion Aautomatizacion Santiago Rios Diaz

describe("sustentacion de ejercicio de automatizacion", () => {
  beforeEach(function() {
    cy.fixture("users/sustentacion").as("data");
  });

  const visitURL = url => {
    cy.visit(url)
      .get("#add")
      .click();
    cy.location("pathname").should("eq", "/computers/new");
  };

  const filterSearch = name => {
    cy.get("#searchbox")
      .type(name)
      .should("have.value", name);
    cy.get("form").submit();
  };

  const createNewComputer = dataPC => {
    cy.get("#name")
      .type(dataPC.nombre)
      .should("have.value", dataPC.nombre);
    cy.get("#introduced")
      .type(dataPC.fechaInicial)
      .should("have.value", dataPC.fechaInicial);
    cy.get("#discontinued")
      .type(dataPC.fechaFinal)
      .should("have.value", dataPC.fechaFinal);
    cy.get("#company")
      .select(dataPC.compania)
      .should("have.value", "36");
    cy.get("form").submit();
  };

  it("Crear un registro y verificar su creacion", function() {
    visitURL(this.data.url);
    createNewComputer(this.data);
    cy.get(".alert-message")
      .invoke("text")
      .then(value => {
        expect(value).to.match(/ Computer Lenovo has been created/);
      });
  });

  it("Realizar la consulta y verificar que la fechaInicial si sea la correcta", function() {
    filterSearch(this.data.nombre);
    cy.location("pathname").should("eq", "/computers");
    cy.get("tbody > :nth-child(1) > :nth-child(1) > a").click();
    cy.get("#introduced")
      .invoke("val")
      .should("to.equal", this.data.fechaInicial);
    cy.get("#main > form:nth-child(2)").submit();
    cy.get(".alert-message")
      .invoke("text")
      .then(value => {
        expect(value).to.match(/Computer Lenovo has been updated/);
      });
  });

  it("Eliminar registro y verificar que se elimino", function() {
    cy.visit(this.data.url);
    filterSearch(this.data.nombre);
    cy.get("tbody > :nth-child(1) > :nth-child(1) > a").click();
    cy.get("#main > form.topRight").submit();
    cy.get(".alert-message")
      .invoke("text")
      .then(value => {
        expect(value).to.match(/Computer has been deleted/);
      });
  });
});
