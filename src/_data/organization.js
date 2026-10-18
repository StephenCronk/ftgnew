// schema.org data for the Home page: the charity and its two clinics, built from site.json and locations.json.
import { readFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

export default function () {
  const site = read('./site.json');
  const locations = read('./locations.json');
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: site.name,
    url: site.url + '/',
    logo: site.url + '/assets/img/ftg-roundlogo.webp',
    image: site.url + '/assets/img/share-card.jpg',
    description: site.description,
    email: site.email,
    sameAs: [site.facebook, site.instagram, site.linkedin],
    department: locations.map((l) => {
      // "4158 Sheppard Ave E, Scarborough, ON M1S 1T3" -> street, city, province, postal code
      const [street, city, regionPostal] = l.address.split(', ');
      const [region, ...postal] = regionPostal.split(' ');
      return {
        '@type': 'Dentist',
        name: l.name,
        email: l.email,
        telephone: '+1-' + l.phone,
        openingHours: l.openingHours,
        address: { '@type': 'PostalAddress', streetAddress: street, addressLocality: city, addressRegion: region, postalCode: postal.join(' '), addressCountry: 'CA' },
      };
    }),
  };
}
