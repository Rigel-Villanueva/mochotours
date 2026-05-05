import { Metadata } from 'next';
import { ContactInfoPanel } from '@/modules/contact-info/ui/ContactInfoPanel';

export const metadata: Metadata = {
  title: 'Contacto | Admin Mochotours',
};

export default function AdminContactoPage() {
  return (
    <ContactInfoPanel />
  );
}
