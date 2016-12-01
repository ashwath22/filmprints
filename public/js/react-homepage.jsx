cosnole.log("react-homepage.jsx");
var hero = document.querySelector("#hero");
    

    var Hero = React.createClass({
      render: function() {
        console.log('render');
        return (
          <div class="heroImage">
            <h1>{this.props.title}</h1>
            <img src="{this.props.imgUrl}" />
            <p>{this.props.leadText}</p>
          </div>
        );
      }
    });

    var el = <Hero title="film-prints" imgUrl="xyz.jpg" leadText="lead text" />;
    ReactDOM.render(el, hero);
