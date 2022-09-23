const votePost = async (
  post,
  isUpvoted = false,
  isDownVoted = false,
  userId,
  operation
) => {
  if (operation === "upvote") {
    if (isUpvoted) {
      post.upVote = post.upVote.filter((id) => id !== userId);
      post.votesCount -= 1;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    } else if (isDownVoted) {
      post.downVote = post.downVote.filter((id) => id !== userId);
      post.upVote.push(userId);
      post.votesCount += 2;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    } else {
      post.upVote.push(userId);
      post.votesCount += 1;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    }
  } else {
    if (isDownVoted) {
      post.downVote = post.downVote.filter((id) => id !== userId);
      post.votesCount += 1;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    } else if (isUpvoted) {
      post.upVote = post.upVote.filter((id) => id !== userId);
      post.downVote.push(userId);
      post.votesCount -= 2;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    } else {
      post.downVote.push(userId);
      post.votesCount -= 1;
      await post.save();
      //WE WANT TO RETURN IN THE UP AND DOWN VOTE ONLY THE USER ENTITY THAT IS VOTING
      //WITHOUT MODIFYING ORIGINALLY SAVED OBJECT
      post.upVote = post.upVote.filter((id) => id === userId);
      post.downVote = post.downVote.filter((id) => id === userId);
    }
  }
};

module.exports = { votePost };
