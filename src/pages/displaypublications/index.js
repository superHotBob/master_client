import Menu_icon from '@/components/icons/menu'
import styles from './display.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react'
import { my_tema, url } from '@/data.'

export default function DisplayPublications() {

    const { color = my_tema[0].color } = useSelector(state => state.counter.profile)
    const router = useRouter()
    const [imagesone, setImagesOne] = useState([])
    const [imagestwo, setImagesTwo] = useState([])
    const [images, setImages] = useState([])
    const [delete_images, setDeleteImages] = useState([])






    const reorder_in_block = (startIndex, endIndex, block) => {
        let result = block === 'one' ? imagesone : imagestwo;
        let new_ind = result[startIndex];
        result[startIndex] = result[endIndex];
        result[endIndex] = new_ind;
        return result;
    };
    const reorder_between_block = (startIndex, endIndex, block) => {
        let result_end = block === 'one' ? imagesone : imagestwo;
        let result_start = block === 'one' ? imagestwo : imagesone;
        let new_ind = result_end[endIndex];
        result_end[endIndex] = result_start[startIndex];
        result_start[startIndex] = new_ind;
        if (block === 'one') {
            setImagesOne(result_end)
            setImagesTwo(result_start)
        } else {
            setImagesOne(result_start)
            setImagesTwo(result_end)
        }
    };

    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        if (!pro.nikname) {
            router.push('/enter')
        }
        fetch(`/api/get_images?nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(res => {
                setImagesOne(res.filter((i, index) => (index + 1) % 2 != 0));
                setImagesTwo(res.filter((i, index) => (index + 1) % 2 === 0))
                setImages(res);


            })

    }, [])



    function SaveImages() {
        for (const i of delete_images) {
            fetch(`/api/delete_images_time?img_date=${i}`)
        }
        for (const [index, i] of imagesone.entries()) {
            fetch(`/api/update_image_rating?id=${i.id}&rating=${images.length - delete_images.length - index * 2 + 1}`)
        }
        for (const [index, i] of imagestwo.entries()) {
            fetch(`/api/update_image_rating?id=${i.id}&rating=${images.length - delete_images.length - index * 2}`)
                .then(res => res.json())
                .then(res => {
                    document.getElementById('message').style.display = 'block',
                        setTimeout(() => document.getElementById('message').style.display = 'none', 2000)
                })
        }

    }

    function onDragEnd(result) {
        if (!result.destination) {
            console.log('return1')
            return;
        }
        if (result.destination.index === imagestwo.length && result.destination.droppableId != 'delete') {
            console.log('return2')
            return;
        }
        if (result.destination.droppableId === 'delete') {
            let result_new = result.source.droppableId === 'one' ? imagesone : imagestwo;
            let new_images = result_new.filter(i => i.img_date !== result.draggableId)
            setDeleteImages(delete_images => ([...delete_images, result.draggableId]))
            if (result.source.droppableId === 'one') {
                setImagesOne(new_images)
            } else {
                setImagesTwo(new_images)
            }
            return;
        } else if (result.destination.droppableId === result.source.droppableId) {
            const new_images = reorder_in_block(
                result.source.index,
                result.destination.index,
                result.destination.droppableId
            );
            setImages(new_images)
        } else {
            const new_images = reorder_between_block(
                result.source.index,
                result.destination.index,
                result.destination.droppableId
            );
        }
    }
    const getListStyle = isDraggingOver => ({
        opacity: isDraggingOver ? "0.8" : "1",
        outline: 'none'

    })
    return (
        <>
            <header className={styles.header}>
                <div
                    onClick={() => router.back()}
                    className={styles.left__arrow}

                >
                    <Menu_icon color={color[1]} />
                </div>
                <span>Показ публицаций</span>
                <span style={{ color: color[1] }} onClick={SaveImages}>Принять</span>
            </header>
            <section>
                <p className={styles.text}>
                    {`Вы можете выбрать порядок публикаций. 
                    Перетаксикайте публикации зажатием.`}
                </p>
            </section>
            <div className={styles.all_drop}>
                <DragDropContext onDragEnd={onDragEnd} >
                    <Droppable
                        droppableId="delete"
                        
                    >
                        {provided => (
                            <div
                                className={styles.delete}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{ outline: 'none' }}
                            >
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>


                    <div className={styles.main_images}>

                        <Droppable
                            droppableId="one"
                           

                        >
                            {(provided, snapshot) => (
                                <div
                                    className={styles.images}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {imagesone?.map((i, index) =>
                                        <Draggable
                                            key={i.img_date}
                                            draggableId={i.img_date}
                                            index={index}
                                            
                                           
                                        >
                                            {(provided, snapshot) => {
                                                const style = {
                                                    border: snapshot.isDragging ? `2px solid ${color[1]}` : 'none',
                                                    ...provided.draggableProps.style,
                                                };
                                                return (
                                                    <img
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className={styles.image}
                                                        style={style}
                                                        alt={i.nikname}
                                                        src={url + '/var/data/' + i.nikname + '/' + i.id + ".jpg"}
                                                    />
                                                )
                                            }}
                                        </Draggable>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <Droppable
                            droppableId="two"                            
                        >
                            {provided => (
                                <div
                                    className={styles.images}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {imagestwo?.map((i, index) =>
                                        <Draggable
                                            key={i.img_date}
                                            draggableId={i.img_date}
                                            index={index}
                                        >
                                            {(provided, snapshot) => {
                                                const style = {
                                                    border: snapshot.isDragging ? `2px solid ${color[1]}` : 'none',
                                                    ...provided.draggableProps.style,
                                                };
                                                return (
                                                    <img
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className={styles.image}
                                                        style={style}
                                                        alt={i.nikname}
                                                        src={url + '/var/data/' + i.nikname + '/' + i.id + ".jpg"}
                                                    />
                                                )
                                            }}
                                        </Draggable>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>


                    </div>


                </DragDropContext>
            </div>
            <h2 id="message" className={styles.message}>Принято</h2>
            <img src="/trash.svg" alt="trash" className={styles.trash} />
        </ >
    )
}