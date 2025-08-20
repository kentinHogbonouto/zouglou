import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface UseFormWithValidationOptions<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: yup.ObjectSchema<any>;
  defaultValues?: Partial<T>;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
}

export function useFormWithValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onChange',
}: UseFormWithValidationOptions<T>): UseFormReturn<T, unknown, FieldValues> {
  return useForm<T>({
    resolver: yupResolver(schema),
    mode,
    defaultValues: defaultValues as DefaultValues<T>,
  });
}

// Utilitaires pour créer des schémas Yup courants
export const yupSchemas = {
  email: yup
    .string()
    .email('Veuillez entrer un email valide')
    .required('L\'email est requis'),

  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    )
    .required('Le mot de passe est requis'),

  confirmPassword: (passwordField: string) =>
    yup
      .string()
      .oneOf([yup.ref(passwordField)], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est requise'),

  requiredString: (minLength = 2, maxLength = 50) =>
    yup
      .string()
      .min(minLength, `Doit contenir au moins ${minLength} caractères`)
      .max(maxLength, `Ne peut pas dépasser ${maxLength} caractères`)
      .required('Ce champ est requis'),

  username: yup
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores')
    .required('Le nom d\'utilisateur est requis'),

  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'Veuillez entrer un numéro de téléphone valide')
    .required('Le numéro de téléphone est requis'),

  url: yup
    .string()
    .url('Veuillez entrer une URL valide')
    .required('L\'URL est requise'),

  requiredCheckbox: yup
    .boolean()
    .oneOf([true], 'Vous devez accepter cette condition')
    .required('Vous devez accepter cette condition'),
};

// Fonction utilitaire pour créer un schéma de formulaire
export function createFormSchema<T>(
  schemaDefinition: Record<keyof T, yup.AnySchema>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): yup.ObjectSchema<any> {
  return yup.object(schemaDefinition).required();
} 