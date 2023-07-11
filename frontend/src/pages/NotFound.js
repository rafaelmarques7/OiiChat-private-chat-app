import Layout from "../components/Layout";
import { Footer } from "../components/footer";

export const PageNotFound = () => (
  <Layout>
    <div id="error-page">
      <h1>404</h1>
      <p>Oops, the page you are looking for could not be found</p>
    </div>
    <Footer />
  </Layout>
);
