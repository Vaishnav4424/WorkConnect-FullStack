function Loader({ text = "Loading..." }) {
    return (
        <div className="d-flex justify-content-center align-items-center gap-3 py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading</span>
            </div>
            <span className="text-muted">{text}</span>
        </div>
    );
}

export default Loader;
