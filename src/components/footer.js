import React from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const footer = () => {
  return (
    <section>
      <footer>
        <div class="container">
          <div class="row justify-content-between">
            <div class="col-auto">
              <h6>PathFinding Visualizer </h6>
            </div>

            <div class="col-auto">
              <p>
                Designed and created by <strong>sn0218</strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default footer;
