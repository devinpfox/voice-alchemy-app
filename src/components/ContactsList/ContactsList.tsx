'use client';

import React from 'react';

interface Contact {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
}

interface ContactsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
}

export default function ContactsList({
  contacts,
  onSelectContact,
  selectedContactId
}: ContactsListProps) {
  return (
    <div>
      <h2 className="contacts-header">Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts available.</p>
      ) : (
        <ul className="contacts-list">
          {contacts.map((contact) => (
            <li
              key={contact._id}
              className={`contact ${contact._id === selectedContactId ? 'selected' : ''}`}
              onClick={() => onSelectContact(contact)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectContact(contact);
              }}
            >
              {contact.username || contact.name || contact.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
