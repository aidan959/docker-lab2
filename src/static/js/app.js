
function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );
    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItem onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">You have no todo items yet! Add one above!</p> 
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItem({ onNewItem }) {
    const { Form, InputGroup, Button, h1, div } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <div>
        <h1>Aidan's Amazing List Website</h1>
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="Add New Item"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
        </div>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval, onItemEdit }) {
    const { Container, Row, Col, Button, Form, InputGroup } = ReactBootstrap;
    const [editing, setEditing] = React.useState(false);
    const [name, setName] = React.useState("");
    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };
    const editItem = (event) => {
        item.name = name; 
        setEditing(!editing);
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemEdit);
    }
    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };
    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <i
                            className={`far ${
                                item.completed ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                {!editing && 
                <Col xs={10} className="name" id={"name_obj"+item.id}>
                    {item.name}
                </Col>
                }
                {editing &&

                <InputGroup className="mb-3" id={"edit_obj"+item.id} >
                    <Form.Control
                        placeholder={item.name}
                        aria-label="Edit text"
                        aria-describedby="basic-addon2"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        
                    />
                    <Button 
                        variant="outline-secondary"
                        id="button-addon2"
                        type="submit"
                        onClick={editItem}
                        >
                        Submit Edit
                    </Button>
                </InputGroup>}
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={() => setEditing(!editing)}
                        aria-label="Edit Item"
                    >
                        <i className="fa fa-pen" />
                    </Button>
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
                
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
