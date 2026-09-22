import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginAuthInput!) {
    login(input: $input) {
      accessToken
      userId
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterAuthInput!) {
    register(input: $input) {
      message
    }
  }
`;