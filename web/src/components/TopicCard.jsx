function TopicCard({ topic, setTopic, setPage, setRedirect }) {
  function handleClick() {
    setTopic(topic);
    setPage("detail");
    setRedirect(true);
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{topic.topic}</h5>
          <h6>{topic.owner.name}</h6>
          <p className="card-text">Created At: {topic.createdAt}</p>
          <a href="#" className="btn btn-primary" onClick={handleClick}>
            Details
          </a>
        </div>
      </div>
    </>
  );
}

export default TopicCard;
