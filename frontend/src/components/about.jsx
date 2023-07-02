export const About = (props) => {
  return (
    <div id='about'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12'>
            <div className='about-text'>
              <h2>How does it work?</h2>
              <h3>Starting a chat is very simple:</h3>
              <div className='list-style'>
                <div className='col-lg-6 col-sm-6 col-xs-12'>
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : 'loading'}
                  </ul>
                </div>
              </div>
              <p>{props.data ? props.data.paragraph : 'loading...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
