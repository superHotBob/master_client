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
    // const { data, mutate } = useSWR(`/api/get_images?nikname=${nikname}`, fetcher)
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        if(!pro.nikname) {
            router.push('/enter')
        }
        fetch(`/api/get_images?nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(res => res.map((i, index) => (index + 1) % 2 != 0 ?
                setImagesOne(imagesone => ([...imagesone, i])) :
                setImagesTwo(imagestwo => ([...imagestwo, i]))
            ))
    }, [])
    function onDragEndOne(result) {        
        if (!result.destination) {
            console.log(result.destination, result.source.index)
            let new_images = imagesone.filter((i, index) => index != result.source.index)
            setImagesOne(new_images)
            return;
        }
        console.log(result.source.index, result.destination.index)
        const new_images = reorder(
            imagesone,
            result.source.index,
            result.destination.index
        );
        setImagesOne(new_images)

    }
    function onDragEndTwo(result) {        
        if (!result.destination) {
            console.log(result.destination, result.source.index)
            let new_images = imagestwo.filter((i, index) => index != result.source.index)
            setImagesTwo(new_images)
            return;
        }
        console.log(result.source.index, result.destination.index)
        const new_images = reorder(
            imagestwo,
            result.source.index,
            result.destination.index
        );
        setImagesTwo(new_images)

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
                <span style={{ color: color[1] }}>Принять</span>
            </header>
            <section>
                <p className={styles.text}>
                    {`Вы можете выбрать порядок публикаций. 
                    Перетаксикайте публикации зажатием.`}
                </p>
            </section>
            <div className={styles.images}>
                <DragDropContext onDragEnd={onDragEndOne} >
                    <Droppable
                        droppableId="board"
                        type="COLUMN"
                        direction="vertical"
                    >
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >

                                {imagesone?.map((i, index) =>


                                    <Draggable key={i.img_date} draggableId={i.img_date} index={index}>
                                        {(provided, snapshot) => (

                                            <img
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}

                                                key={i.id}
                                                alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />


                                        )}
                                    </Draggable>


                                )}
                                {provided.placeholder}
                            </div>
                        )}    
                        </Droppable>
                </DragDropContext>
                <DragDropContext onDragEnd={onDragEndTwo} >
                    <Droppable 
                        droppableId="board"
                        type="COLUMN"
                        direction="vertical"
                    >
                        {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >

                            {imagestwo?.map((i, index) =>


                                <Draggable key={i.img_date} draggableId={i.img_date} index={index}>
                                    {(provided, snapshot) => (
                                        <img
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}

                                            key={i.id}
                                            alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />
                                    )}
                                </Draggable>


                            )}
                            {provided.placeholder}
                        </div>
                 
                        )}

                </Droppable>
            </DragDropContext>

            {/* <div>
                    {images?.filter((i, index) => index % 2 === 0).map(i =>
                        <img onClick={() => Movie(i)} key={i.id} alt={i.nikname} src={url + '/var/data/' + i.nikname + '/' + i.id + '.jpg'} />)}
                </div> */}
        </div>


        </main >
    )
}