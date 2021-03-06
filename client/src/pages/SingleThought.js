import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import Auth from '../utils/auth';
import ReactionFrom from '../components/ReactionFrom';

const SingleThought = props => {

  const { id: thoughtId } = useParams();
  console.log(thoughtId);

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });

  const thought = data?.thought || {};

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
      {Auth.loggedIn() && <ReactionFrom thoughtId={thought._id} />}
    </div>
  );
};

export default SingleThought;
