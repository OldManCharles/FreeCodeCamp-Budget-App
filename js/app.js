class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // sumbit expense method
  submitExpenseForm() {
    const amountValue = this.amountInput.value;
    const expenseValue = this.expenseInput.value;

    if (expenseValue === '' || amountValue === '') {
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Neither the expense name or value can be empty.</p>`;
    } else if (amountValue < 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Expense value cannot be negative.</p>`;
    } else {
      this.expenseFeedback.classList.remove('showItem');

      let amount = parseInt(amountValue);
      this.amountInput.value = '';
      this.expenseInput.value = '';

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount:amount,
      }

      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  // submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value; // data entered by user in text field
    if (value === '' || value < 0) {
      this.budgetFeedback.classList.add('showItem'); // adding class to this item to show it
      this.budgetFeedback.innerHTML = `<p>Value cannot be empty or negative</p>`;
    } else {
      this.budgetFeedback.classList.remove('showItem');
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  showBalance() {
    const expense = this.getTotalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;

    if (total < 0) {
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    } else {
      this.balance.classList.add('showBlack');
    }
  }

  getTotalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function(acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }

    this.expenseAmount.textContent = total;

    return total;
  }

  addExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>`;

    this.expenseList.appendChild(div);
  }

  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // remove from DOM
    this.expenseList.removeChild(parent);
    // remove from the list
    let expense = this.itemList.filter(function(item) {
      return item.id === id;
    });

    // show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    // remove from list
    let tempList = this.itemList.filter(function(item) {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }

  deleteExpense(element) {
    // remove from list
    let tempList = this.itemList.filter(function(item) {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  // new instance of UI class
  const ui = new UI();

  // budget form submit
  budgetForm.addEventListener('submit', function() {
    event.preventDefault();
    ui.submitBudgetForm();
  });

  // expense form submit
  expenseForm.addEventListener('submit', function () {
    event.preventDefault();
    ui.submitExpenseForm();
  });

  // expense click
  expenseList.addEventListener('click', function(event) {
    if (event.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  eventListeners();
});