import React from "react";

type HeaderContactsProps = {
  phone: string;
  email: string;
  linkedin: string;
};

export default function HeaderContacts({ phone, email, linkedin }: HeaderContactsProps) {
  return (
    <p className="text-sm">
      <a href={`tel:${phone.replace(/\D/g, '')}`}>{phone}</a> ·{' '}
      <a href={`mailto:${email}`}>{email}</a> ·{' '}
      <a href={linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    </p>
  );
}
