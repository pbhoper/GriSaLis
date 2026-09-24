import { gql } from '@apollo/client';

export const GET_READY_PCS = gql`
    query GetReadyPcs {
        pcs {
            id
            name
            price
            description
            imageUrl
            inStock
            specs {
                cpu
                gpu
                ram
                storage
            }
        }
    }
`;