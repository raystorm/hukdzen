import React from 'react';
import '../../App.css';

export default function LandingPage()
{
    return (
        <div>
          <h1>Welcome to Smalgyax-Files.org</h1>
          <h2>Algyax Amwaal - Tsimpshian Language Treasures</h2>
          <div className='twoColumn' >
            <div>
              {/* TODO: language selection tabs for welcome message */}
              <p>
                We aim to be a secure web application for registered users
                store, find and tag Smalgyax Language learning files and Documents.
                Documents are owned by uploaded users,
                and shared with there implied permission by the use of this site to other registered users.
              </p>
              <p>
                Registered accounts, need email, and name.  So we can know who the account belongs to.
                and we can contact them with any issues, or important updates.
              </p>
              <p>
                TODO: Message about Language Preservation and welcome here
              </p>
              <p>
                <em>TODO:</em> Add Audio (Video?) Player here,
                with a recorded Smalgyax Welcome Message.
              </p>
            </div>
            <div>
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
                  {/*<li>gooyu dm gan t'oyagan (What are you thankful for?)</li>*/}
                  <li>Small But Mighty (tsuusk ada al ap gatgyet)</li>
                  {/*gal t’iilt ha’wakadi gaksgii (It's too early I haven't worken up yet. )*/}
                </ul>
              </div>
              <hr className='sub-break'/>
              <p>Info Graphic here!</p>
            </div>
          </div>
        </div>
    );
}