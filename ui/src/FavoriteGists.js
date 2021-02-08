import {gql, useQuery} from '@apollo/client';

const GIST_FAVORITE_QUERY = gql`
	query {
		favoriteGists {
			username
			description
			gistId
			isFavorite
			dateCreated
			files
		}
	}
`;

const FavoriteGists = () => {
	const {loading, error, data} = useQuery(GIST_FAVORITE_QUERY);
	if (loading) {
		return <p>Loading favorite gists...</p>;
	}
	if (error) {
		return <p>Error querying gists {error.message}</p>;
	}
	if (!data.favoriteGists || !data.favoriteGists.length) {
		return <p>No favorite gists found</p>;
	}
	return (
		<ul>
			{data.favoriteGists.map((favorite) => (
				<li key={favorite.gistId}>
					{favorite.dateCreated}: {favorite.description}
				</li>
			))}
		</ul>
	);
};

export {FavoriteGists};
