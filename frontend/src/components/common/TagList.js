export default function TagList(props) {
    return (
        <ul class="tag-list noto">
            {props.tag.map((item, idx) => (
                <li key={idx}><a href="#">{item}</a></li>
            ))}
        </ul>
    );
}