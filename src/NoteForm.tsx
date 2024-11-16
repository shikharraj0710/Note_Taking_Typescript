import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidv4 } from "uuid"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void,
    onAddTag: (data: Tag) => void,
    availableTags: Tag[]
} & Partial<NoteData>

export default function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        });
        navigate("..");
    }

    return <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} defaultValue={title} required />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <CreatableSelect
                            onCreateOption={label => {
                                const newTag = { id: uuidv4(), label };
                                onAddTag(newTag);
                                setSelectedTags(prev => [...prev, newTag])
                            }}
                            value={selectedTags.map(tag => ({ label: tag.label, value: tag.id }))}
                            options={availableTags.map(tag => {
                                return { label: tag.label, value: tag.id }
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, id: tag.value }
                                }))
                            }}
                            isMulti
                            required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control ref={markdownRef} defaultValue={markdown} required as="textarea" rows={15} />
                </Form.Group>
            </Row>
            <Row>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit">Save</Button>
                    <Link to="..">
                        <Button type="button" variant="secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Row>
        </Stack>
    </Form>
}