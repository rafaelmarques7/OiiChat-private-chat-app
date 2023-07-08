import ParticlesBg from "particles-bg";
import { ButtonNewChat } from "./ButtonNewChat";
import { ButtonLink } from "./ButtonLink";
import { loadUserDetails } from "../lib/utils";

export const Header = (props) => {
  console.log("inside home, REACT_APP_FOO=", process.env.REACT_APP_FOO);
  const { isLoggedIn } = loadUserDetails();

  return (
    <header id="header">
      <div className="intro">
        <ParticlesBg
          type="lines"
          bg={{ zIndex: 0, position: "absolute", top: 0 }}
        />
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <ButtonNewChat />
                <div style={{ padding: "0.5em" }}></div>
                <ButtonLink
                  label="See public rooms"
                  targetUrl={"/rooms/public-rooms"}
                />
                {isLoggedIn && (
                  <>
                    <div style={{ padding: "0.5em" }}></div>
                    <ButtonLink
                      label="See my conversations"
                      targetUrl={"/rooms/my-rooms"}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
