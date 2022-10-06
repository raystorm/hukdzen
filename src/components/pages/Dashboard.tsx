import React from 'react';
import RecentDocuments from '../widgets/RecentDocuments';

export default function Dashboard()
{
    // TODO: Configurable dashboard
    // TODO: Recent Documents Widget
    // TODO: Owned Documents Widget
    // TODO: Document details view
    return (
        <div>
            <div>
              {/* TODO: Replace w/ Recent Documents Widget (limit/scroll) */}
              <RecentDocuments />
              {/* TODO: Replace w/ Owned/Authored Documents Widget (limit/scroll) */}
              <div>
                <h2>Owned/Authored Documents</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Nahawt(BC)</th>
                      <th>Nahawt(AK)</th>
                      <th>author</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      Soluta, voluptate.
                      <td>Lorem ipsum</td>
                      <td>dolor sit amet</td>
                      <td>consectetur,</td>
                      <td>adipisicing elit.</td>
                    </tr>
                    <tr>
                      <td>Doloribus</td>
                      <td>nostrum</td>
                      <td>iusto possimus</td>
                      <td>quas totam,</td>
                    </tr>
                    <tr>
                      <td>sed mollitia,</td>
                      <td>cumque nisi voluptate explicabo</td>
                      <td>quis et velit in quae officiis,</td>
                      <td>quibusdam enim?</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* TODO: float right */}
            <div>
              <p>Detail Properties for Selected Document</p>  
              <p>link to go to full document properties</p>
              <p>download a copy</p>
            </div>
        </div>
    );
}