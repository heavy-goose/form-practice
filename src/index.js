import "./reset.css";
import "./styles.css";

const validator = {
  init() {
    this.cacheDom();
    this.bindEvents();

    this.postalConstraints = {
      ch: ["^(CH-)?\\d{4}$", "Swiss postal codes must have exactly 4 digits: e.g. CH-1950 or 1950"],
      fr: [
        "^(F-)?\\d{5}$",
        "French postal codes must have exactly 5 digits: e.g. F-75012 or 75012",
      ],
      de: [
        "^(D-)?\\d{5}$",
        "German postal codes must have exactly 5 digits: e.g. D-12345 or 12345",
      ],
    };
  },
  cacheDom() {
    this.form = document.querySelector("form");
    this.email = this.form.querySelector("#email");
    this.emailError = this.form.querySelector("#email + span.error");
    this.country = this.form.querySelector("#country");
    this.countryError = this.form.querySelector("#country + .error");
    this.postal = this.form.querySelector("#postal");
    this.postalError = this.form.querySelector("#postal + .error");
    this.password = this.form.querySelector("#password");
    this.passwordError = this.form.querySelector("#password + .error");
    this.confirmation = this.form.querySelector("#confirm");
    this.confirmationError = this.form.querySelector("#confirm + .error");
  },
  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.email.addEventListener("input", () => this.handleEmailInput());
    this.postal.addEventListener("input", () => this.handlePostalInput());
    this.country.addEventListener("change", () => this.handlePostalInput());
    this.password.addEventListener("input", () => this.handlePasswordInput());
    this.confirmation.addEventListener("input", () => this.handleConfirmationInput());
  },
  handleConfirmationInput() {
    if (this.confirmation.value === "") {
      this.showConfirmationError("empty");
    } else if (this.password.value !== this.confirmation.value) {
      this.showConfirmationError("no-match");
    } else if (this.password.classList.contains("invalid")) {
      this.showConfirmationError("invalid");
    } else {
      this.clearConfirmationError();
    }
  },
  clearConfirmationError() {
    this.confirmationError.textContent = "";
    this.confirmationError.classList.remove("active");
    this.confirmation.classList.remove("invalid");
  },
  showConfirmationError(reason) {
    this.confirmationError.classList.add("active");
    this.confirmation.classList.add("invalid");
    switch (reason) {
      case "empty":
        this.confirmationError.textContent = "This field cannot be empty";
        break;
      case "no-match":
        this.confirmationError.textContent = "Must match the password";
        break;
      case "invalid":
        this.confirmationError.textContent = "Password must be valid";
        break;
      default:
        break;
    }
  },
  handlePasswordInput() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (this.password.value === "") {
      this.showPasswordError("empty");
    } else if (!passwordRegex.test(this.password.value)) {
      this.showPasswordError("invalid");
    } else {
      this.clearPasswordError();
    }
    if (this.confirmation.value !== "") {
      this.handleConfirmationInput();
    }
  },
  clearPasswordError() {
    this.passwordError.textContent = "";
    this.passwordError.classList.remove("active");
    this.password.classList.remove("invalid");
  },
  showPasswordError(reason) {
    this.passwordError.classList.add("active");
    this.password.classList.add("invalid");
    switch (reason) {
      case "empty":
        this.passwordError.textContent = "This field cannot be empty";
        break;
      case "invalid":
        this.passwordError.textContent =
          "Must contain at least 8 characters, one lowercase letter, one uppercase letter, one number, one special character: @$!%*?#&_";
        break;
      default:
        break;
    }
  },
  handlePostalInput() {
    if (!this.country.value) {
      if (this.postal.value !== "") {
        this.showPostalError("no-country");
      } else {
        this.clearPostalError();
      }
      return;
    }

    if (this.postal.value === "") {
      this.showPostalError("empty");
      return;
    }

    const constraint = new RegExp(this.postalConstraints[this.country.value][0]);
    if (!constraint.test(this.postal.value)) {
      this.showPostalError("invalid");
    } else {
      this.clearPostalError();
    }
  },
  clearPostalError() {
    this.postalError.textContent = "";
    this.postalError.classList.remove("active");
    this.postal.classList.remove("invalid");
  },
  showPostalError(reason) {
    switch (reason) {
      case "no-country":
        this.postalError.textContent = "Select a country above";
        break;
      case "invalid":
        this.postalError.textContent = this.postalConstraints[this.country.value][1];
        break;
      case "empty":
        this.postalError.textContent = "This field cannot be empty";
        break;
      default:
        this.postalError.textContent = "Invalid postal code";
    }

    this.postalError.classList.add("active");
    this.postal.classList.add("invalid");
  },
  handleEmailInput() {
    if (this.email.validity.valid) {
      this.emailError.textContent = "";
      this.emailError.classList.remove("active");
    } else {
      this.showEmailError();
    }
  },
  handleSubmit(e) {
    e.preventDefault();

    if (!this.email.validity.valid) {
      this.showEmailError();
    } else if (!this.country.value) {
      this.showPostalError("no-country");
    } else if (this.postal.classList.contains("invalid")) {
      this.handlePostalInput();
    } else if (this.password.classList.contains("invalid")) {
      this.handlePasswordInput();
    } else if (this.confirmation.classList.contains("invalid")) {
      this.handleConfirmationInput();
    } else {
      this.emailError.classList.remove("active");
      this.clearPostalError();
      this.clearPasswordError();
      this.clearConfirmationError();
      alert("Form Submitted!");
    }
  },
  showEmailError() {
    if (this.email.validity.valueMissing) {
      this.emailError.textContent = "This field cannot be empty.";
    } else if (this.email.validity.typeMismatch) {
      this.emailError.textContent = "You need to enter an email address.";
    } else if (this.email.validity.tooShort) {
      this.emailError.textContent = `Email should be at least ${this.email.minLength} characters; you entered ${this.email.value.length}.`;
    }
    this.emailError.classList.add("active");
  },
};

validator.init();
