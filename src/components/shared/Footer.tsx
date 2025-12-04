import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import { DONATE_PATH } from './constants';

const Footer: React.FC = () => {
   return (
      <footer>
         <div style={{clear: 'both'}}>
            <hr style={{margin: '10px'}}/>
            <ul>
               <li><a href='/Privacy-Policy.html'>Privacy Policy</a></li>
               <li><a href={DONATE_PATH}>Dzeex (Donate)</a></li>
               <li>
                  <a href='https://github.com/raystorm/hukdzen/'>
                     <GitHubIcon style={{verticalAlign: 'middle', height: '.7em',
                                         margin: '0', color: '#000000' }} />
                     <span style={{marginLeft: '.1em'}}>
                        Source code on Github
                     </span>
                  </a>
               </li>
            </ul>
            <hr style={{margin: '10px'}}/>
            <p>Copyright (c) 2023 Smalgyax-Files.org</p>
         </div>
      </footer>
   );
};

export default Footer;