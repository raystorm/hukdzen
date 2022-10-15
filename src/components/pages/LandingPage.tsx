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
              <p>
                <em>TODO:</em> Add Audio (Video?) Player here,
                with a recorded Smalgyax Welcome Message.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Voluptates dolorem perferendis id nam! Earum sequi libero quia asperiores repellendus. 
                Sequi eum ut at facilis a quam error iusto esse rem.
              </p>
            </div>
            <div className='right'>
              <p>Future enhancement idea:  Announcements here!</p>
              <div style={{ marginRight: 'auto', marginLeft: 'auto', 
                            display: 'flex', justifyContent: 'center'}}>
                <ul style={{textAlign: 'left'}}>
                  <li>G̱atgyeda'nu (I am strong)</li>
                  <li>Wilgoosga'nu (I am wise)</li>
                  <li>Alag̱a'nu (I am brave)</li>
                  <li>Lusgüü gayaała! (I am fortnuate)</li>
                  <li>Lusgüü gayaała da k'wan (you are lucky)</li>
                  <li>Siip’n da txa'nii gyetda ‘nüüyu (I am loved)</li>
                  <li>Ła gwilm gawdiiyu (I am ready)</li>
                  <li>‘Lah! I for to add huk ayaaltgn (I am fortunate)</li>
                  <li>Ła gwilm gawdiiym (we are ready)</li>
                  <li>Ha’lig̱oodu nagooga dm dzapt (I think before I act)</li>
                  <li>ap sguu dm waalu da awaan (You belong here)</li>
                  <li>sm gyet gedden (you are an important person)</li>
                  <li>amanii łala gyedden (Take care of each other)</li>
                  <li>ap shiwaatgida goodu goo la hawyu (Say what's in your heart)</li>
                </ul>
              </div>
              <hr style={{width: '80%'}}/>
              <p>Info Graphic here!</p>
            </div> 
        </div>
    );
}