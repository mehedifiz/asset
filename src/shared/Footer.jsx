import PageTitle from "../components/pageTitle/PageTitle";

const Footer = () => {
  return (
    <div>
      <section>
        <PageTitle title={"Footer"}></PageTitle>
      </section>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>
            Copyright &copy;2024 - All right reserved by{" "}
            <span className="font-roboto font-bold uppercase">
              Asset<span className="text-primary font-lato">H</span>ub
            </span>{" "}
            Software Ltd.
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
