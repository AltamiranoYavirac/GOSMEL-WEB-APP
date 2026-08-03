export interface IContactFormValues {
  fullName: string;
  email: string;
  instrument: string;
  message: string;
}

export type TInstrumentOption = {
  label: string;
  value: string;
};