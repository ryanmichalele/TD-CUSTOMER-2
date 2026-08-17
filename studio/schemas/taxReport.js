import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'taxReport',
  title: 'Tax Report (1099)',
  type: 'document',
  fields: [
    defineField({
      name: 'taxYear',
      title: 'Tax Year',
      type: 'string',
      description: 'e.g. "2025"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'availableDate',
      title: 'Available Date',
      type: 'date',
      description: 'When the 1099 forms become available',
    }),
    defineField({
      name: 'accountNumber',
      title: 'Account Number',
      type: 'string',
      description: 'Account number associated with this tax report',
    }),
    defineField({
      name: 'forms',
      title: 'Available Forms',
      type: 'array',
      description: 'List of downloadable 1099 forms',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'form',
          title: 'Form',
          fields: [
            defineField({
              name: 'formType',
              title: 'Form Type',
              type: 'string',
              description: 'e.g. 1099-INT, 1099-DIV, 1099-B, 1099-OID',
            }),
            defineField({
              name: 'downloadUrl',
              title: 'Download URL',
              type: 'url',
              description: 'Link to download the PDF form',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Brief description of what this form covers',
            }),
          ],
          preview: {
            select: { title: 'formType', subtitle: 'downloadUrl' },
          },
        }),
      ],
    }),
    defineField({
      name: 'instructions',
      title: 'How to Access',
      type: 'text',
      rows: 4,
      description: 'Step-by-step instructions for users to find their 1099',
    }),
    defineField({
      name: 'notes',
      title: 'Important Notes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Additional notes or disclaimers',
    }),
  ],
  preview: {
    select: { title: 'taxYear', subtitle: 'accountNumber' },
  },
})