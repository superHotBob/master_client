import Menu_icon from '@/components/icons/menu'
import styles from './display.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())
import { url, my_data } from '@/data.'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react'



export default function DisplayPublications() {
    const { color = my_data.my_tema[0].color, nikname } = useSelector(state => state.counter.profile)
    const router = useRouter()
    const [imagesone, setImagesOne] = useState([])
    const [imagestwo, setImagesTwo] = useState([])
    const [images, setImages] = useState([])
    // const { data, mutate } = useSWR(`/api/get_images?nikname=${nikname}`, fetcher)
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        if (!pro.nikname) {
            router.push('/enter')
        }
        fetch(`/api/get_images?nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(res => {
                setImages(res),
                    res.map(i => i.rating % 2 === 0 ?
                        setImagesOne(imagesone => ([...imagesone, i])) :
                        setImagesTwo(imagestwo => ([...imagestwo, i])),
                    )
            }
            )
    }, [])

    useEffect(()=>{
        console.log(images)
    },[images])

    function SaveImages() {
        for (const [index, i] of images.entries()) {
            fetch(`/api/update_image_rating?id=${i.id}&rating=${images.length -  index + 1}`)
            .then(res=>res.json())
            .then(res=>console.log(res))
        }
    }
    function onDragEndOne(result) {
        if (!result.destination) {
            return;
        }
        console.log(result.source.index, result.destination.index)
        if (+result.source.index % 2 === 0) {
            const new_images = reorder(
                imagesone,
                result.source.index,
                result.destination.index
            );
            setImagesOne(new_images)

        } else {
            const new_images = reorder(
                imagestwo,
                result.source.index,
                result.destination.index
            );
            setImagesTwo(new_images)
        }


    }
    function onDragEnd(result) {
        console.log(result)
        if (!result.destination) {
            return;
        }

        const new_images = reorder(
            images,
            result.source.index,
            result.destination.index
        );
        setImages(new_images)
    }

    return (
        <main>
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
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="board"
                    direction="vertical"
                >
                    {provided => (
                        <div
                            className={styles.images}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {images?.map((i, index) =>
                                <Draggable
                                    key={i.img_date}
                                    draggableId={i.img_date}
                                    index={index}
                                >
                                    {provided => (
                                        <img
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            provided={provided}
                                            className={styles.image}
                                            key={i.img_date}
                                            alt={i.nikname}
                                            src={url + '/var/data/' + i.nikname + '/' + i.id + ".jpg"} 
                                        />
                                    )}
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </main >
    )
}