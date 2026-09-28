import { gql } from '@apollo/client';

export const GET_COMPONENTS = gql`
    query GetComponents {
        components {
            id
            name
            category
            price
        }
    }
`;

export const CREATE_ASSEMBLY_MUTATION = gql`
    mutation CreateAssembly($input: CreateAssemblyPcInput!) {
        createAssembly(input: $input) {
            id
            name
            totalPrice
            componentIds
        }
    }
`;