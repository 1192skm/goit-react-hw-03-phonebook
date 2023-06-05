import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };
  addContact = ({ name, number }) => {
    const newContact = {
      id: nanoid(),
      name,
      number,
    };
    this.state.contacts.some(contact => contact.name === newContact.name)
      ? alert(`${newContact.name} is already contact`)
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };
  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  handleFilter = evt => {
    this.setState({ filter: evt.currentTarget.value });
  };
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsContacts = JSON.parse(contacts);
    if (parsContacts) {
      this.setState({ contacts: parsContacts });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const normFilter = this.state.filter.toLocaleLowerCase();
    const findContacts = this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(normFilter)
    );
    return (
      <div className={css.container}>
        <h1 className={css.title}>
          Phone<span className={css.accent}>book</span>
        </h1>
        <ContactForm onSubmit={this.addContact} />

        <h2 className={css.subtitle}>Contacts</h2>
        <Filter onFilter={this.handleFilter} state={this.state.filter} />
        <ContactList
          findContacts={findContacts}
          onDeleteContact={this.deleteContact}
        />
      </div>
    );
  }
}
