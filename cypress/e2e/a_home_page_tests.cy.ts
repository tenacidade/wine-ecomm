describe('Browsing the store', () => {
  beforeEach('Mock api', () => {
    cy.intercept('/products?page=1&limit=12&filter=&name=', { fixture: 'wine-api-1.json' });
    cy.intercept('/products?page=2&limit=12&filter=&name=', { fixture: 'wine-api-2.json' });
    cy.intercept('/products?page=1&limit=12&filter=0-40&name=', { fixture: 'wine-api-3.json' });
  });

  describe('Accessing product details', () => {
    it('Scene 1: By clicking on the card, you are redirected to the product details page', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');
      
      cy.visit('/');

      cy.wait('@api');
  
      cy.get('[data-cy="home_page_card_product-0"]')
        .click();

      cy.url().should('include', '/product/0');

      cy.get('[data-cy="details_products_name_product"]')
        .contains('Produto 1');
      });
  });

  describe('Navigating between pages', () => {
    it.only('Scene 2: On first page, previous page button is disabled', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');

      cy.visit('/');

      cy.wait('@api');

      cy.get('[data-cy="home_page_navigate_btn-previous"]')
        .should('be.disabled');
    });

    it.only('Scene 3: Current page button changes color', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');

      cy.visit('/');

      cy.wait('@api');

      cy.get('[data-cy="home_page_navigate_btn-0"]')
        .should('have.css', 'background-color', 'rgb(168, 36, 114)');

      cy.get('[data-cy="home_page_navigate_btn-1"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .click();
    });

    it('Scene 4: On the last page, the next page button is disabled', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');
      
      cy.visit('/');

      cy.wait('@api');

      cy.get('[data-cy="home_page_navigate_btn-1"]')
        .click();

      cy.wait('@api');

      cy.get('[data-cy="home_page_navigate_btn-next"]')
        .should('be.disabled');
    });
  });

  describe('Adding products to winebox', () => {
    it('Scene 5: When adding a product to the winebox, the count number increases', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');

      cy.visit('/');

      cy.wait('@api');

      cy.get('[data-cy="winebox-btn-count"]')
        .contains('0');

      cy.get('[data-cy="card_product-btn-add-0"]')
        .click();

      cy.get('[data-cy="card_product-btn-add-1"]')
        .click();

      cy.get('[data-cy="card_product-btn-add-2"]')
        .click();

      cy.get('[data-cy="winebox-btn-count"]')
        .contains('3');
    });
  });

  describe('Filter products by price', () => {
    it('Scene 6: Select the "Até R$40" filter', () => {
      cy.intercept({
        method: 'GET',
        url: '/products*',
      }).as('api');

      cy.visit('/');

      cy.wait('@api');

      cy.get('[data-cy="filter-radio-1"]')
        .contains('Até R$40')
        .click();

      cy.wait('@api');

      cy.get('[data-cy="home_page_info_find_products"]')
        .contains('4 produtos encontrados');

      cy.get('[data-cy="home_page_card_product-0"]')
        .contains('Produto 5');

      cy.get('[data-cy="home_page_card_product-1"]')
        .contains('Produto 6');

      cy.get('[data-cy="home_page_card_product-2"]')
        .contains('Produto 10');

      cy.get('[data-cy="home_page_card_product-3"]')
        .contains('Produto 12');
    });
  });
});
