import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { VFC } from 'react';
import HomeSection from './HomeSection';
import Carousel from 'react-grid-carousel';
import { NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { gql, useQuery } from '@apollo/client';

// TODO replace hardcoded list with gql query result
const featuredListings: {address: string, marketplace: string}[] = [
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
  {address: '9CZmL7zc87Qc4d8svJdVHjmmd5V9TVhGAqvziv7ibV1K', marketplace: 'junglecats'},
];

const PageLeftButton = (
  <button
    className="flex items-center justify-center absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-125 transition"
  >
    <ChevronLeftIcon className="h-4 w-4" />
  </button>
);

const PageRightButton = (
  <button
    className="flex items-center justify-center absolute right-0 top-1/2 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-125 transition"
  >
    <ChevronRightIcon className="h-4 w-4" />
  </button>
);

const FeaturedBuyNowListingsSection: VFC = () => {
  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>What&apos;s Hot</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <Carousel
          cols={3}
          rows={2}
          gap={10}
          arrowLeft={PageLeftButton}
          arrowRight={PageRightButton}
        >
          {featuredListings.map((s) => (
            <Carousel.Item key={s}>
              <div key={s.address}>
                <NFTCardDataWrapper address={s.address} marketplace={s.marketplace}/>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </HomeSection.Body>
    </HomeSection>
  );
};


//TODO replace stuff below this with autogenerated query stuff
const GET_NFT_DATA = gql`
query NFTCardQuery($subdomain: String!, $address: String!) {
  nft(address: $address) {
    name
    description
    image
    creators {
      share
    }
    offers {
      price
    }
    owner {
      address
    }
    listings {
      auctionHouse
      address
    }
    purchases {
      price
    }
    address
  }
  marketplace(subdomain: $subdomain) {
    auctionHouse {
      sellerFeeBasisPoints
      address
      stats {
        floor
        average
      }
      auctionHouseTreasury
      authority
    }
    auctionHouseAddress
    configAddress
    ownerAddress
    subdomain
    storeAddress
  }
}
`;


const NFTCardDataWrapper: VFC<{address: string, marketplace: string}> = ({address, marketplace}) => {
  const {
    data,
    loading,
    refetch,
  } = useQuery(GET_NFT_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      subdomain: marketplace,
      address: address
    },
  });
  return <NFTCard nft={data?.nft} marketplace={data?.marketplace} refetch={refetch} loading={loading} />
}

export default FeaturedBuyNowListingsSection;
