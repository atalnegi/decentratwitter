import { useState, useEffect } from 'react'
import { Row, Form, Button, Card, Col } from 'react-bootstrap'
import axios from 'axios';

const App = ({ contract }) => {
    const [profile, setProfile] = useState('')
    const [nfts, setNfts] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const loadMyNFTs = async () => {
        // Get users nft ids
        const results = await contract.getMyNfts();
        // Fetch metadata of each nft and add that to nft object.
        let nfts = await Promise.all(results.map(async i => {
            // get uri url of nft
            const uri = await contract.tokenURI(i)
            // fetch nft metadata
            console.log("URI",uri)
            const response = await fetch(uri)
            console.log("Response",response)
            const metadata = await response.json()
            console.log("MEta",metadata)
            return ({
                id: i,
                username: metadata.username,
                avatar: metadata.avatar
            })
        }))
        setNfts(nfts)
        getProfile(nfts)
    }
    const getProfile = async (nfts) => {
        const address = await contract.signer.getAddress()
        const id = await contract.profiles(address)
        const profile = nfts.find((i) => i.id.toString() === id.toString())
        setProfile(profile)
        setLoading(false)
    }

    const sendJSONtoIPFS = async (ImgHash) => {

        try {
    
          const resJSON = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
            data: {
              "username": username,
              "avatar": ImgHash
            },
            headers: {
                'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
    
            },
          });    
    
          const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
          console.log("Token URI", tokenURI);

          mintProfile(tokenURI)
        } catch (error) {
            window.alert("JASON to IPFS error: ", error)
        }
    
    
    }

    const uploadToIPFS = async (e) => {

        e.preventDefault();
        console.log("123");
        console.log(e);
        if (avatar) {
          try {
    
            console.log("1234");
            const formData = new FormData();
            formData.append("file", avatar);
            console.log(formData)
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
                    "Content-Type": "multipart/form-data"
                },
              });
    
            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log(ImgHash);
            sendJSONtoIPFS(ImgHash)
    
    
          } catch (error) {
            console.log("File to IPFS: ")
            console.log(error)
          }
        }
      } 
    
      const mintProfile = async (uri) => {
        if (!avatar || !username) return
        try {
            setLoading(true)
            await (await contract.mint(uri)).wait()
            loadMyNFTs()
        } catch (error) {
            window.alert("ipfs uri upload error: ", error)
        }
    }  
    
    const switchProfile = async (nft) => {
        setLoading(true)
        await (await contract.setProfile(nft.id)).wait()
        getProfile(nfts)
    }
    useEffect(() => {
        if (!nfts) {
            loadMyNFTs()
        }
    })
    if (loading) return (
        <div className='text-center'>
            <main style={{ padding: "1rem 0" }}>
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div className="mt-4 text-center">
            {profile ? (<div className="mb-3"><h3 className="mb-3">{profile.username}</h3>
                <img className="mb-3" style={{ width: '400px' }} src={profile.avatar} /></div>)
                :
                <h4 className="mb-4">No profile, please create one...</h4>}

            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                        <Form.Control onChange={(e) => setAvatar(e.target.files[0])} size="lg" required type="file" name="file" />
                            <Form.Control onChange={(e) => setUsername(e.target.value)} size="lg" required type="text" placeholder="Username" />
                            <div className="d-grid px-0">
                                <Button onClick={uploadToIPFS} variant="primary" size="lg">
                                    Create Profile
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
            <div className="px-5 container">
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                    {nfts.map((nft, idx) => {
                        if (nft.id === profile.id) return
                        return (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={nft.avatar} />
                                    <Card.Body color="secondary">
                                        <Card.Title>{nft.username}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className='d-grid'>
                                            <Button onClick={() => switchProfile(nft)} variant="primary" size="lg">
                                                Set as Profile
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        </div>
    );
}

export default App;
