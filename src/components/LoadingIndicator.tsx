type LoadingIndicatorProps = {
  fullscreen?: boolean;
};
const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { fullscreen = false } = props;

  return (
    <div
      className={
        "flex justify-center items-center " + (fullscreen ? "min-h-screen" : "")
      }
    >
      <div className="loading-indicator">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
