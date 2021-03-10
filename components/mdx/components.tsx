const components = {
  wrapper: (props) => (
    <div
      style={{
        width: "100%",
        padding: "20px",
      }}
    >
      <main {...props} />
    </div>
  ),
};

export default components;
