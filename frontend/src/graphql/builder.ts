import { gql } from '@apollo/client';

export const GET_COMPONENTS = gql`
    query GetComputerComponents {
        components {
            id
            name
            category
            price
        }
    }
`;

export const CREATE_ASSEMBLY_MUTATION = gql`
    mutation CreateAssembly($input: CreateAssemblyInput!) {
        createAssembly(input: $input) {
            id
            totalPrice
            createdAt
        }
    }
`;