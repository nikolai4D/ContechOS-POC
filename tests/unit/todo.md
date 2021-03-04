To test:

    SECURITY/TOKEN-SPEC:
        -

    Navbar:

        - If user is logged in, then the name of the user is expected to be visible.
        - If the user clicks on the Log out button, then user should be forwarded back to the Login page and logged out.    

        Login page:

            - If user logs in with invalid username/password, then a triggered error message is expected. 
            - If user logs in with valid username/password, then the user should be forwarded to the Home page.
            
        Home page:

            Graph / Sidebar:
                
                General:

                    - If user clicks on the Page buttons on Sidebar, then user should be forwarded to the pages.
                    - If user click on the toggle on the buttom of Sidebar, then there should be more/fewer pages to choose from.

                    - If edit pen is clicked -> Able to edit prop (text field)
                    - If check button for node in edit is clicked, then expected to be visible on canvas
                    - If check button for node/node+rel in create is clicked, then validated -> expected to be visible on canvas
                    - If check button for rel in create is clicked, then validated -> expected to be visible on canvas
                    - If delete button for node is clicked, then validate if there is a rel towards node -> expected to be removed from canvas
                    - If updated node, expected to be updated on canvas
                    - Label (title) on nodes in graph
                    - Type (title) on rel in graph
                    - Chips reps the nodes in graph

                Config:
                    
                    - If user clicks on dropdown menu, then the names of the config pages are visible.

                    Config config:
                
                        Node: 

                            R-click:
                                
                                Menu:
                                
                                    Create node -rel-> new node:

                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)
                                            
                                            Rel: 
                                                
                                                Drop down ("Rel")

                                                - HAS_REL, HAS_DATATYPE, TO_NODE

                                                - Arrow down
                                            
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    + drop down ("Label"):

                                                        - Node, Rel, DataType, Label, LabelVal, Prop, PropVal
                                                
                                                Properties: 
                                                
                                                    - Textfields ("Key", "Value") 
                                            
                                    Create -rel->:
    
                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)

                                            Rel: 
                                                
                                                Drop down ("Rel")

                                                - HAS_REL, HAS_DATATYPE, TO_NODE

                                                - Arrow down

                                            (Bef):

                                                - If node is clicked -> third section changes label to Node Title
                                
                                    Edit node:

                                        Sidebar: 

                                            Labels:

                                                - Fixed (Page, Node Title)
                                                    
                                            Properties:

                                                - Textfields ("Key", "Value") 

                            L-click:

                                Sidebar: 

                                    Labels:
                                            
                                        - Fixed (Page, Node Title)
                                        
                                    Properties
                                        - Textfields (key, value (can be ''))
                                    
                                    - Edit button                                      
    
                        Relationship:

                            R-click:

                                Menu:
                                
                                    - No option, only title

                            L-click:
                            
                                - Sidebar opens 

                                        Sidebar:

                                            Type:
                                                
                                                - Fixed (rel type)
                                            
                                            Source:

                                                - Fixed (rel source)
                                           
                                            Target: 

                                                - Fixed (rel target)

                        Canvas:

                            R-click:

                                Menu:
                            
                                    Create Node:

                                        Sidebar: 
                                                
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    + drop down ("Label"):

                                                        - Node, Rel, DataType, Label, LabelVal, Prop, PropVal
                                                
                                                Properties: 
                                                
                                                    - Textfields ("Key", "Value") 
                                                    
                                            Check button:

                                                - Validate Label drop down not empty -> should create a node in graph

                            L-click:

                                - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 
                                - Reset


                    Config Admin/System/Information/Data:

                        Node: 

                            R-click:
                                
                                Menu:
                                
                                    Create node -rel-> new node:

                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)
                                            
                                            Rel: 
                                                
                                                Drop down ("Rel")

                                                - Based on Rel nodes in Config Config

                                                - Arrow down
                                            
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    + drop down ("Label"):

                                                        - Based on what that Rel node in Config Config has a "TO_NODE"-rel to.
                                                
                                                Properties: 
                                                
                                                    - Textfields ("Key", "Value") 
                                            
                                    Create -rel->:
    
                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)

                                            Rel: 
                                                
                                                Drop down ("Rel"), shows when clicked second node

                                                    - Based on Rel node that the first node has a "HAS_REL" rel to, which it self has a "TO_NODE" to the second node.

                                                - Arrow down

                                            (Bef):

                                                - If node is clicked -> third section changes label to Node Title
                                
                                    Edit node:

                                        Sidebar: 

                                            Labels:

                                                - Fixed (Page, Node Title)
                                                    
                                            Properties:

                                                - Textfields ("Key", "Value") 

                            L-click:

                                Sidebar: 

                                    Labels:
                                            
                                        - Fixed (Page, Node Title)
                                        
                                    Properties
                                        - Textfields (key, value (can be ''))
                                    
                                    - Edit button                                      
    
                        Relationship:

                            R-click:

                                Menu:
                                
                                    - No option, only title

                            L-click:
                            
                                - Sidebar opens 

                                        Sidebar:

                                            Type:
                                                
                                                - Fixed (rel type)
                                            
                                            Source:

                                                - Fixed (rel source)
                                           
                                            Target: 

                                                - Fixed (rel target)

                        Canvas:

                            R-click:

                                Menu:
                            
                                    Create Node:

                                        Sidebar: 
                                                
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    + drop down ("Label"):

                                                        - Node, Rel, DataType, Label, LabelVal, Prop, PropVal
                                                
                                                Properties: 
                                                
                                                    - Textfields ("Key", "Value") 
                                                    
                                            Check button:

                                                - Validate Label drop down not empty -> should create a node in graph

                            L-click:

                                - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 
                                - Reset



                    Admin:
                    
                        Node: 

                            R-click:
    
                                Menu:
                                
                                    Create node <-rel- new node:

                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)
                                            
                                            Rel: 
                                                
                                                - Textfield ("Rel")
                                                - Arrow down


                                            
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    - Textfield based on what property value the node "Label" has (ex nodeLabel in {key: nodeLabel}) in AdminConfig, that has the rel "HAS_LABEL" from node "LabelVal", with property {value: ''}
                                                
                                                Properties: 
                                                
                                                    - Textfields based on what property value the node "Prop" has (ex title in {key: title}) in AdminConfig, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                                Child Properties: 

                                                    Plus sign to add Child Property:
                                                        
                                                        - Autocomplete ("Prop"), both drop down and text field

                                                        - Dropdown ("DataType")

                                            Check button:

                                                - Validate Label textfield and Rel textfield not empty -> should create a node in graph


                                    Create -rel->:
    
                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)

                                            Rel: 
                                                
                                                - Textfield ("Rel")
                                                - Arrow down

                                            (Bef):

                                                - If node is clicked -> third section changes label to Node Title

                                            Check button:

                                                - Validate Rel textfield not empty -> should create a node in graph

                                    Edit node:

                                        Sidebar: 

                                            Labels:

                                                - Fixed (Page)
                                                - Textfield (Node Title) 

                                            Properties: 
                                            
                                                - Textfields based on what property value the node "Prop" has (ex title in {key: title}) in AdminConfig, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                            Child Properties: 

                                                Plus sign to add Child Property:
                                                    
                                                    - Autocomplete ("Prop"), both drop down and text field

                                                    - Dropdown ("DataType")

                                                Delete button
                           
                            L-click:

                                Sidebar: 

                                    Labels:
                                            
                                        - Fixed (Page, Node Title)
                                        
                                    Properties
                                        - Textfields (key, value (can be ''))

                                    - Child properties w/ add sign
                                    
                                    - Edit button            

                        Relationship:

                            R-click:

                                Menu:
                                
                                    - No option, only title

                            L-click:
                            
                                - Sidebar opens 

                                        Sidebar:

                                            Type:
                                                
                                                - Fixed (rel type)
                                            
                                            Source:

                                                - Fixed (rel source)
                                           
                                            Target: 

                                                - Fixed (rel target)
                                            

                        Canvas:

                            R-click:

                                Menu:
                            
                                    Create Node:

                                        - Based on node in Admin Config with property {key: root}

                                        Sidebar: 
                                                
                                            (Ny) 
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    - Textfield based on what property value the node "Label" has (ex nodeLabel in {key: nodeLabel}) in AdminConfig, that has the rel "HAS_LABEL" from node "LabelVal", with property {value: ''}
                                                
                                                Properties: 
                                                
                                                    - Textfields based on what property value the node "Prop" has (ex title in {key: title}) in AdminConfig, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                                Child Properties: 

                                                    Plus sign to add Child Property:
                                                        
                                                        - Autocomplete ("Prop"), both drop down and text field

                                                        - Dropdown ("DataType")

                                            Check button:

                                                - Validate Label textfield not empty -> should create a node in graph

                            L-click:

                                - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 
                                - Reset

                    System:
                    
                           Node: 

                            R-click:
    
                                Menu:
                                
                                    Create node <-rel- new node:

                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)
                                            
                                            Rel: 
                                                
                                                - Textfield ("Rel"), autogenerates after choosing Parent Node
                                                - Arrow down
                                            
                                            (Ny) 

                                                Parent Node:

                                                    Dropdown:

                                                        - Based on Admin

                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    - Textfield based on what property value the node "Label" has (ex nodeLabel in {key: nodeLabel}) in System Config, that has the rel "HAS_LABEL" from node "LabelVal", with property {value: ''}
                                                
                                                Properties: 
                                                
                                                    - Textfields based on what property value in System Config + child properties the Parent Node has (ex title in {key: title}) in Admin, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                                Child Properties: 

                                                    Plus sign to add Child Property:
                                                        
                                                        - Autocomplete ("Prop"), both drop down and text field

                                                        - Dropdown ("DataType")

                                            Check button:

                                                - Validate Label textfield not empty -> should create a node in graph

                                    Create -rel->:
    
                                        Sidebar: 

                                            (Nod) 
                                                
                                                Labels: 
                                                
                                                    - Fixed (Node Title)

                                            Rel: 
                                                
                                                - Textfield ("Rel")
                                                - Arrow down

                                            (Bef):

                                                - If node is clicked -> third section changes label to Node Title

                                            Check button:

                                                - Validate Rel textfield not empty -> should create a node in graph

                                    Edit node:

                                        Sidebar: 

                                            Labels:

                                                - Fixed (Page)
                                                - Textfield (Node Title) 

                                            Properties: 
                                            
                                                - Textfields based on what property value the node "Prop" has (ex title in {key: title}) in AdminConfig, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                            Child Properties: 

                                                Plus sign to add Child Property:
                                                    
                                                    - Autocomplete ("Prop"), both drop down and text field

                                                    - Dropdown ("DataType")

                                                Delete button
                           
                            L-click:

                                Sidebar: 

                                    Labels:
                                            
                                        - Fixed (Page, Node Title)
                                        
                                    Properties
                                        - Textfields (key, value (can be ''))

                                    - Child properties w/ add sign
                                    
                                    - Edit button            

                        Relationship:

                            R-click:

                                Menu:
                                
                                    - No option, only title

                            L-click:
                            
                                - Sidebar opens 

                                        Sidebar:

                                            Type:
                                                
                                                - Fixed (rel type)
                                            
                                            Source:

                                                - Fixed (rel source)
                                           
                                            Target: 

                                                - Fixed (rel target)
                                            

                        Canvas:

                            R-click:

                                Menu:
                            
                                    Create Node:

                                        Sidebar: 
                                                
                                            (Ny) 

                                                Parent Node:

                                                    Dropdown:

                                                        - Based on Admin root nodes, i.e. nodes that only has rels toward themselves, and are based on Admin Config node with property {key: root}
                                            
                                                Labels: 
                                                
                                                    - Fixed (Page) 
                                                
                                                    - Textfield based on what property value the node "Label" has (ex nodeLabel in {key: nodeLabel}) in Syste Config, that has the rel "HAS_LABEL" from node "LabelVal", with property {value: ''}
                                                
                                                Properties: 
                                                
                                                    - Textfields based on what property value + child properties the Parent Node has (ex title in {key: title}) in SystemConfig, that has the rel "TO_NODE" from node "Rel" that has rel "HAS_REL" from node "Node"

                                                Child Properties: 

                                                    Plus sign to add Child Property:
                                                        
                                                        - Autocomplete ("Prop"), both drop down and text field

                                                        - Dropdown ("DataType")

                                            Check button:

                                                - Validate Label textfield not empty -> should create a node in graph

                            L-click:

                                - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 
                                - Reset

                    Information:
                    
                        Create:

                            Node: 

                                R-click:
                                    
                                    Menu:

                                L-click:

                                    Sidebar:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset

                        Read:

                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset


                        Update:

                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset


                        Delete:
                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset

                    Data:
                    
                        Create:

                            Node: 

                                R-click:
                                    
                                    Menu:

                                L-click:

                                    Sidebar:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset

                        Read:

                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset


                        Update:

                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and the information in the sidebar will disapear. 

                                    - Reset


                        Delete:
                            Node: 

                                R-click:

                                L-click:

                            Relationship:

                                R-click:

                                L-click:

                            Canvas:

                                R-click:

                                L-click:

                                    - If a node/rel is in focus, then it'll get unselected and 
                                    
                                    - Resetthe information in the sidebar will disapear. 