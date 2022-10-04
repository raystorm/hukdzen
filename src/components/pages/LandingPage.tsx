import React from 'react';
import '../../App.css';

export default function LandingPage()
{
    return (
        <div>
            <h2>Welcome to Smalgyax-Files.org</h2>
            <div className='left'>
              {/* TODO: language selection tabs for welcome message */}
              <p>
                We aim to be a one stop shop for you to store and find Smalgyax Language learning files and Documents.
              </p>
              <p>
                TODO: Message about Language Preservation and welcome here
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Voluptates dolorem perferendis id nam! Earum sequi libero quia asperiores repellendus. 
                Sequi eum ut at facilis a quam error iusto esse rem.
              </p>
            </div>
            <div className='right'>
              <p>Future enhancement idea:  Announcements here!</p>  
              <p>Info Graphic here!</p>
            </div> 
        </div>
    );
}