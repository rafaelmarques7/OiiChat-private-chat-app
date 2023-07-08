import ParticlesBg from "particles-bg";
import { ButtonNewChat } from "./ButtonNewChat";

export const Header = (props) => {
  console.log("inside home, REACT_APP_FOO=", process.env.REACT_APP_FOO);

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
