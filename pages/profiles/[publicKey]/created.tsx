import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import cx from 'classnames';
import { DoubleGrid } from '@/common/components/icons/DoubleGrid';
import { TripleGrid } from '@/common/components/icons/TripleGrid';
import { useNftsByCreatorQuery } from '../../../src/graphql/indexerTypes';
import Link from 'next/link';
import TextInput from '@/common/components/elements/TextInput';
import { Avatar } from '../../nfts/[address]';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { imgOpt } from '../../../src/common/utils';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';

// type OwnedNFT = OwnedNfTsQuery['nfts'][0];

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const NFTCard = ({ nft }: { nft: OwnedNFT }) => {
  const creatorsCopy = [...nft.creators];
  const sortedCreators = creatorsCopy.sort((a, b) => b.share - a.share);
  const shownCreatorAddress = sortedCreators.length > 0 ? sortedCreators[0].address : null;
  return (
    <Link href={`/nfts/${nft.address}`} passHref>
      <a className="transform overflow-hidden rounded-lg border-gray-800 shadow-2xl transition duration-[300ms] hover:scale-[1.02]">
        <img
          src={imgOpt(nft.image)}
          alt={nft.name}
          className=" aspect-square h-80 w-full object-cover"
        />
        <div className="h-24 bg-gray-900 py-6 px-4">
          <p className="w-max-fit m-0 mb-2 min-h-[28px] truncate text-lg">{nft.name}</p>
          {shownCreatorAddress && (
            <Link href={`/profiles/${shownCreatorAddress}`}>
              <a className="text-gray-300">
                <Avatar address={shownCreatorAddress} />
              </a>
            </Link>
          )}
        </div>
      </a>
    </Link>
  );
};

const NFTGrid = ({ nfts, gridView }: { nfts: OwnedNFT[]; gridView: '2x2' | '3x3' }) => {
  return (
    <div
      className={cx(
        'grid grid-cols-1 gap-6',
        gridView === '2x2' ? 'md:grid-cols-2' : 'md:grid-cols-3'
      )}
    >
      {nfts.map((nft) => (
        <NFTCard key={nft.address} nft={nft} />
      ))}
    </div>
  );
};

const CreatedNFTs: NextPage<WalletDependantPageProps> = (props) => {
  const { publicKey: pk } = props;
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridView, setGridView] = useState<'2x2' | '3x3'>('3x3');
  const { data } = useNftsByCreatorQuery({
    variables: {
      address: pk,
      limit: 100,
      offset: 0,
    },
  });
  const nfts = data?.nfts || [];

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  const GridSelector = () => {
    return (
      <div className="ml-4 hidden rounded-lg border-2 border-solid border-gray-800 md:flex">
        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '2x2',
          })}
          onClick={() => setGridView('2x2')}
        >
          <DoubleGrid
            className={gridView !== '2x2' ? 'transition hover:scale-110 ' : ''}
            color={gridView === '2x2' ? 'white' : '#707070'}
          />
        </button>

        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '3x3',
          })}
          onClick={() => setGridView('3x3')}
        >
          <TripleGrid
            className={gridView !== '3x3' ? 'transition hover:scale-110' : ''}
            color={gridView === '3x3' ? 'white' : '#707070'}
          />
        </button>
      </div>
    );
  };

  return (
    <ProfileDataProvider profileData={props}>
      <Head>
        <title>{showFirstAndLastFour(pk)}&apos;s NFTs | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer>
        <div className="mb-4 flex">
          <TextInput
            id="owned-search"
            label="owned search"
            hideLabel
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={
              <FeatherIcon
                icon="search"
                aria-hidden="true"
                className={searchFocused ? 'text-white' : 'text-gray-500'}
              />
            }
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <GridSelector />
        </div>
        <NFTGrid nfts={nftsToShow} gridView={gridView} />
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default CreatedNFTs;
