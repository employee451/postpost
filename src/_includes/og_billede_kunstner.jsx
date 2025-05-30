/** @jsxImportSource npm:react@18.2.0 */

export default async function (props) {
	const { titel, hurtigtekst, id } = props
	const imageUrl = `https://post-post.dk/billeder/kunstnere/${id}-medium.jpg`;
	const imageTestResponse = await fetch(imageUrl);
	const shouldUseImage = imageTestResponse.status === 200;

	return (
	  <article style={{
		borderRadius: '0.75rem',
		borderWidth: '8px',
		borderStyle: 'solid',
		borderColor: '#52525b',
		backgroundColor: '#ffffff',
		padding: '1.5rem',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		justifyContent: 'space-between'
	  }}>
		<div style={{
		  display: 'flex',
		  alignItems: 'center',
		  gap: '1.5rem'
		}}>
		  {shouldUseImage && (
			<div style={{
				width: '150px',
				height: '150px',
				borderRadius: '150px',
				overflow: 'hidden',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#f3f4f6'
			  }}>
				<img 
				  src={imageUrl}
				  style={{
					width: '150',
					height: '150',
					objectFit: 'cover',
					display: 'block'
				  }}
				/>
			</div>
		  )}
		  <div style={{
			display: 'flex',
			flexDirection: 'column'
		  }}>
			<h2 style={{
			  fontFamily: 'georgia',
			  fontSize: '4rem',
			  letterSpacing: '0.05em',
			  color: '#18181b',
			  fontWeight: 'bold',
			  margin: '0',
			  display: 'block'
			}}>
			  {titel}
			</h2>
		  </div>
		</div>
		{hurtigtekst && (
			<div style={{
				fontFamily: 'georgia',
				fontSize: '2.5rem',
				lineHeight: '1.75',
				color: '#18181b',
				display: 'block',
				flex: '1',
				paddingTop: '1.5rem'
				}}>
				{hurtigtekst}
			</div>
		)}
	  </article>
	);
  }