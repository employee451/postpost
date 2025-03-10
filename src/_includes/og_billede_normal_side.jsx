/** @jsxImportSource npm:react@18.2.0 */

export default function ({ titel, beskrivelse }) {
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
			  gap: '0.75rem'
			}}>
			  <h2 style={{
				fontFamily: 'georgia',
				fontSize: '3rem',
				letterSpacing: '0.05em',
				color: '#18181b',
				fontWeight: 'bold'
			  }}>
				{titel}
			  </h2>
			</div>
			{beskrivelse && (
				<div style={{
					fontFamily: 'georgia',
					fontSize: '2rem',
					lineHeight: '1.75',
					color: '#18181b',
					display: 'block',
					flex: '1',
					paddingTop: '1rem'
				}}>
				{beskrivelse}
				</div>
			)}
		</article>
	);
  }