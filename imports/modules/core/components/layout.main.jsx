import React from 'react';
import {Flex} from 'jsxstyle'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
// <RaisedButton label="New Post" primary={true} />
const MainHeader = () => (
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text="# economics" />
    </ToolbarGroup>
    <ToolbarGroup float='right' lastChild={true}>
      <RaisedButton primary={true} label='New Post' labelPosition='after'>
          <FontIcon className='material-icons' color='white' style={{
              verticalAlign: 'middle',
              height: '100%',
              marginLeft: 8,
             }}>add_circle</FontIcon>
      </RaisedButton>
    </ToolbarGroup>
  </Toolbar>
)

export default ({content = () => null }) => (
    <main style={{
        marginLeft: 256,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MainHeader />
      <section className='post-list' style={{flexGrow: 1}}>
        <article>
          <h2>Section 1.10.32 of 'de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
        </article>
        <article>
          <h2>1914 translation by H. Rackham</h2>
          <p>
            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?
          </p>
        </article>
        <article>
          <h2>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h2>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
        </article>
      </section>
    </main>
)
